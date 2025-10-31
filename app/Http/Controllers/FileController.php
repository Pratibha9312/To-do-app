<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\File;
use App\Models\FileRelation;

class FileController extends Controller
{
    public function destroy(File $file)
    {
        try {
            // 🔹 Delete all relations linked to this file
            FileRelation::where('file_id', $file->id)->delete();

            // 🔹 Delete physical file if exists
            if (Storage::disk('public')->exists($file->path)) {
                Storage::disk('public')->delete($file->path);
            }

            // 🔹 Delete DB record for the file itself
            $file->delete();

            return back()->with('success', 'File is deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('File deletion failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete the file.');
        }
    }
}
