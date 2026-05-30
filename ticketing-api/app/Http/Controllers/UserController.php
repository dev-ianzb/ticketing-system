<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    // -------------------------
    // GET ALL USERS (PROFILES)
    // -------------------------
    public function index()
    {
        return DB::table('profiles')
            ->select('id', 'email', 'full_name', 'role')
            ->where('role', '!=', 'admin')
            ->where('role', '!=', 'user')
            ->get();
    }

    // -------------------------
    // CREATE IT STAFF
    // -------------------------
    public function createItStaff(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        // NOTE: assumes profiles already linked to auth.users
        $id = (string) Str::uuid();

        // insert into profiles (role-based app table)
        DB::table('profiles')->insert([
            'id' => $id,
            'email' => $request->email,
            'full_name' => $request->name ?? 'IT Staff',
            'role' => 'it_staff',
        ]);

        return response()->json([
            'id' => $id,
            'email' => $request->email,
            'role' => 'it_staff'
        ]);
    }

    // -------------------------
    // UPDATE ROLE
    // -------------------------
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,it_staff,admin'
        ]);

        DB::table('profiles')
            ->where('id', $id)
            ->update([
                'role' => $request->role
            ]);

        return response()->json([
            'id' => $id,
            'role' => $request->role
        ]);
    }

    // -------------------------
    // GET IT STAFF ONLY
    // -------------------------
    public function itStaff()
    {
        return DB::table('profiles')
            ->where('role', 'it_staff')
            ->select('id', 'full_name', 'email')
            ->get();
    }
}