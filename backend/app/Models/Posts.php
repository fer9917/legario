<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $user_id
 * @property string $title
 * @property string $content
 * @property integer $status
 * @property string $date
 */
class Posts extends Model
{
    /**
     * @var array
     */
    protected $fillable = ['user_id', 'title', 'content', 'status', 'date'];
}
