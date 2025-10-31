<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage; 

class File extends Model
{
    protected $fillable = ['original_name', 'path'];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return Storage::url($this->path);
    }

    // Relationship to FileRelation
    public function relations()
    {
        return $this->hasMany(FileRelation::class);
    }
}
