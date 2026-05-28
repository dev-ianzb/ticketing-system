<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $connection = 'pgsql';
    protected $table = 'profiles';

    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'email',
        'full_name',
        'role',
        'department',
        'created_at',
        'expo_push_token',
    ];
}