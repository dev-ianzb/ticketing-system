<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Ticket extends Model
{
    protected $fillable = [
        'id',
        'title',
        'description',
        'priority',
        'category',
        'status',
        'created_by',
        'assigned_to',
        'resolved_at'
    ];

    public $incrementing = false;

    protected $keyType = 'string';

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}