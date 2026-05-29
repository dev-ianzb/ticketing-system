<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CommentController extends Controller
{
    // GET COMMENTS
    public function index($ticketId)
    {
        return Comment::query()
    ->where('ticket_id', $ticketId)
    ->leftJoin('profiles', 'comments.author_id', '=', 'profiles.id')
    ->select(
        'comments.*',
        'profiles.full_name as author_name'
    )
    ->orderBy('comments.created_at', 'asc')
    ->get();
    }

    // CREATE COMMENT
    public function store(Request $request, $ticketId)
{
    $request->validate([
        'body' => 'required'
    ]);

    $comment = Comment::create([
        'id' => (string) Str::uuid(),
        'ticket_id' => $ticketId,
        'author_id' => $request->user_id,
        'body' => $request->body,
        'created_at' => now(),
    ]);

    return response()->json($comment);
}
}