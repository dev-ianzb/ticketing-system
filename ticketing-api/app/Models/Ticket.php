<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'tickets';

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'category',
        'created_by',
        'assigned_to',
        'resolved_at'
    ];
}