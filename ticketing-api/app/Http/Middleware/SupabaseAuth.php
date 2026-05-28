<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Http;

class SupabaseAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        // Decode payload only (simple validation)
        $payload = json_decode(base64_decode($parts[1]), true);

        if (!$payload || !isset($payload['sub'])) {
            return response()->json(['message' => 'Invalid token payload'], 401);
        }

        // Attach user to request
        $request->merge([
            'user_id' => $payload['sub']
        ]);

        return $next($request);
    }
}