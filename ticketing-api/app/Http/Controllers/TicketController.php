<?php
namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    // public function index(Request $request)
    // {

    // $query = Ticket::query()
    //     ->where('created_by', $request->user_id);


    // return $query->latest()->get();

    // }
//     public function index(Request $request)
// {
//     $query = Ticket::query();

//     $role = $request->role;
//     $userId = $request->user_id;

//     if ($role === 'user') {
//         $query->where('created_by', $userId);
//     }

//     if ($role === 'it_staff') {
//         $query->where(function ($q) use ($userId) {
//             $q->where('assigned_to', $userId)
//               ->orWhere('status', 'open');
//         });
//     }

//     // admin = no restrictions

//     return $query->latest()->get();
// }
public function index(Request $request)
{
    $role = $request->role;

    // ADMIN
    if ($role === 'admin') {
        return Ticket::all();
    }

    // IT STAFF
    if ($role === 'it_staff') {

        return Ticket::where(function ($query) use ($request) {

            $query->where('assigned_to', $request->user_id)
                ->orWhere(function ($q) {
                    $q->where('status', 'open')
                      ->whereNull('assigned_to');
                });

        })->get();
    }

    return Ticket::where(
        'created_by',
        $request->user_id
    )->get();
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

    $role = $request->role;

    // ONLY ADMIN OR IT STAFF
    if (!in_array($role, ['admin', 'it_staff'])) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }

    $ticket->update($request->only([
        'status',
        'priority',
        'assigned_to',
        'category',
        'title',
        'description'
    ]));

    // AUTO RESOLVE TIME
    if ($request->status === 'resolved') {
        $ticket->resolved_at = now();
        $ticket->save();
    }

    return response()->json($ticket);
}

    public function destroy($id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->status = 'removed';
        $ticket->save();

        return response()->json([
            'message' => 'Ticket marked as removed'
        ]);
    }

    public function assign(Request $request, $id)
{
    $request->validate([
        'assigned_to' => 'required|uuid'
    ]);

    $ticket = Ticket::findOrFail($id);

    $ticket->assigned_to = $request->assigned_to;
    $ticket->status = 'in_progress';
    $ticket->save();

    return response()->json($ticket);
}
}