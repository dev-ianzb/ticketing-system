<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Ticket extends Model
{
    use HasUuids;

    protected $connection = 'pgsql'; // Supabase

    protected $table = 'tickets';

    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'title',
        'description',
        'status',
        'priority',
        'category',
        'created_by',
        'assigned_to',
        'created_at',
        'updated_at',
        'resolved_at',
    ];
}