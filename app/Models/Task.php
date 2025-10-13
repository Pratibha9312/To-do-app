<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
