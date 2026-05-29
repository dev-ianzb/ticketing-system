<?php
namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    public function index(Request $request)
    {

    $query = Ticket::query()
        ->where('created_by', $request->user_id);


    return $query->latest()->get();

    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'priority' => 'required',
            'category' => 'required',
        ]);

        $ticket = Ticket::create([
            'id' => (string) Str::uuid(),
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'category' => $request->category,
            'status' => 'open',
            'created_by' => $request->user_id
        ]);

        return response()->json($ticket);
    }

    public function show($id)
    {
        return Ticket::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $ticket->update($request->only([
            'title',
            'description',
            'status',
            'priority',
            'category',
            'assigned_to'
        ]));

        if ($request->status === 'resolved') {
            $ticket->resolved_at = now();
            $ticket->save();
        }

        return response()->json($ticket);
    }

    public function destroy($id)
    {
        $ticket = Ticket::findOrFail($id);

        // SOFT DELETE (your requirement)
        $ticket->status = 'removed';
        $ticket->save();

        return response()->json([
            'message' => 'Ticket marked as removed'
        ]);
    }
}