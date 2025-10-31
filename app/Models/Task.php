<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage; 

class Task extends Model
 {
    protected $table = 'task';

    protected $fillable = [ 
        'title',
        'description',
        'is_completed',
        'due_date',
        'list_id'
    ];

    public function list()
    {
        return $this->belongsTo(TaskList::class, 'list_id');
    }

    public function fileRelations()
    {
        return $this->hasMany(FileRelation::class, 'type_id')
                    ->where('type', 'T');
    }

    public function file()
    {
        return $this->hasOneThrough(
            File::class,          
            FileRelation::class,
            'type_id',            
            'id',                
            'id',           
            'file_id'      
        )->where('file_relations.type', 'T');
    }
}
