<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = 'profiles';

    protected $fillable = [
        'email',
        'fullname',
        'role',
        'department',
        'expo_push_token'
    ];
}