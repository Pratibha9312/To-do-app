<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage; 

class FileRelation extends Model
{
    protected $fillable = ['file_id', 'type_id', 'type'];

    public function file()
    {
        return $this->belongsTo(File::class);
    }

    // optional helper relationships
    public function task()
    {
        return $this->belongsTo(Task::class, 'type_id')->where('type', 'T');
    }

    public function list()
    {
        return $this->belongsTo(TaskList::class, 'type_id')->where('type', 'L');
    }

}
