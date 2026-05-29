<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Comment extends Model
{
    use HasUuids;

    protected $connection = 'pgsql';

    protected $table = 'comments';

    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'ticket_id',
        'author_id',
        'body',
        'created_at',
    ];
}