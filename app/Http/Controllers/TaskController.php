<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TaskList;
use App\Models\Task;
use App\Models\File;
use App\Models\FileRelation;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::with(['list', 'file'])
        ->whereHas('list', function($query){
            $query->where('user_id',auth()->id());
        })->orderBy('created_at', 'desc');

        if(request()->has('search')){
            $search = request('search');
            $query->where(function($q) use ($search)
            {
                $q->where("title","like","%{$search}")
                ->orWhere('description', 'like', "%{$search}");
            });
        }
        if(request()->has('filter') && request('filter')!== 'all')
        {
            $query->where('is_completed',request('filter')==='completed');
        }
        $tasks = $query->paginate(10);
        $lists = TaskList::where('user_id',auth()->id())->get();
        
        return Inertia::render('Tasks/Index',[
            'tasks'=>$tasks,
            'lists'=>$lists,
            'filters'=>[
                'serach' =>request('search',''),
                'filter'=>request('filter','')
            ],
            'flash'=>[
                'success' =>session('success'),
                'error'=>session('error')
            ]
         ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'=>'required|string|max:225',
            'description'=>'nullable|string',
            'due_date'=>'nullable|date',
            'list_id'=>'required|exists:list,id',
            'is_completed'=>'boolean',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,pdf,txt|max:5120',
            'type' => 'nullable|in:T,L|required_with:attachment',
        ]);
        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'list_id' => $validated['list_id'],
            'is_completed' => $validated['is_completed'] ?? false,
        ]);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');

            // Store file in /storage/app/public/attachments
            $path = $file->store('attachments', 'public');

            // Create entry in files table
            $storedFile = File::create([
                'original_name' => $file->getClientOriginalName(),
                'path' => $path,
            ]);

            FileRelation::create([
                'file_id' => $storedFile->id,
                'type' => 'T',
                'type_id' => $task->id,
            ]);
        }

        return redirect()->route('tasks.index')->with('success','Task created successfully.');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title'=>'required|string|max:225',
            'description'=>'nullable|string',
            'due_date'=>'nullable|date',
            'list_id'=>'required|exists:list,id',
            'is_completed'=>'boolean',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,pdf,txt|max:5120',
            'type' => 'nullable|in:T,L|required_with:attachment',
        ]);
         $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'list_id' => $validated['list_id'],
            'is_completed' => $validated['is_completed'] ?? false,
        ]);

        if ($request->file('attachment')) {

             // Delete existing file if any
            $existingRelation = FileRelation::where('type', 'T')
                                            ->where('type_id', $task->id)
                                            ->first();

            if ($existingRelation) {
                $existingFile = File::find($existingRelation->file_id);
                if ($existingFile) {
                    \Storage::disk('public')->delete($existingFile->path);
                    $existingFile->delete();
                }
                $existingRelation->delete();
            }

            $file = $request->file('attachment');
            $path = $file->store('attachments', 'public');

            // Create new file record
            $storedFile = File::create([
                'original_name' => $file->getClientOriginalName(),
                'path' => $path,
            ]);
            FileRelation::create([
                'file_id' => $storedFile->id,
                'type' => 'T',
                'type_id' => $task->id,
            ]);
        }

        return redirect()->route('tasks.index')->with('success','Task updated successfully.');
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Get all related files
        $fileRelations = FileRelation::where('type', 'T') ->where('type_id', $task->id)->get();
        foreach ($fileRelations as $relation) {
            $file = File::find($relation->file_id);
            if ($file) {
                // Delete physical file
                \Storage::disk('public')->delete($file->path);

                // Delete file record
                $file->delete();
            }

            // Delete relation
            $relation->delete();
        }
        $task->delete();
        return redirect()->route('tasks.index')->with('success','Task deleted successfully');
    
    }
}
