<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $user_id
 * @property integer $post_id
 * @property string $content
 */
class Comments extends Model {
    /**
     * @var array
     */
    protected $fillable = ['user_id', 'post_id', 'content'];
}
