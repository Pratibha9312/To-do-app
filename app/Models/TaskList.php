<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskList extends Model
{
    protected $table = 'list';
    
    protected $fillable = [
        'title',
        'description',
        'user_id'
    ];

    public function list()
    {
        return $this->hasMany(Task::class);
    }

     public function user()
    {
        return $this->belongsTo(User::class);
    }
}
