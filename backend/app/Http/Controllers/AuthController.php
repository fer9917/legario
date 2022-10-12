<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller {
    /**
     * Create User
     * @param Request $request
     * @return User 
     */
    public function createUser(Request $request) {
        try {
            //Validated
            $validateUser = Validator::make(
                $request->all(),
                [
                    'email' => 'required|email|unique:users,email',
                    'password' => 'required',
                    'name' => 'required',
                ]
            );

            if ($validateUser->fails()) {
                return response()->json([
                    'errors' => $validateUser->errors(),
                    'message' => 'validation error',
                    'status' => false,
                ], 401);
            }

            $user = User::create([
                'password' => Hash::make($request->password),
                'email' => $request->email,
                'name' => $request->name,
            ]);

            return response()->json([
                'token' => $user->createToken("API TOKEN")->plainTextToken,
                'message' => 'User Created Successfully',
                'status' => true,
                'user' => $user,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Login The User
     * @param Request $request
     * @return User
     */
    public function loginUser(Request $request) {
        try {
            $validateUser = Validator::make(
                $request->all(),
                [
                    'email' => 'required|email',
                    'password' => 'required'
                ]
            );

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            if (!Auth::attempt($request->only(['email', 'password']))) {
                return response()->json([
                    'message' => 'Email & Password does not match with our record.',
                    'status' => false,
                ], 401);
            }

            $user = User::where('email', $request->email)->first();

            return response()->json([
                'token' => $user->createToken("API TOKEN")->plainTextToken,
                'message' => 'User Logged In Successfully',
                'status' => true,
                'user' => $user,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
                'status' => false,
            ], 500);
        }
    }

    /**
     * Login The User
     * @param Request $request
     * @return User
     */
    public function recoveryPassword(Request $request) {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            return User::where('email', $request->email)
                ->update(['password' => Hash::make($request->password)]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
                'status' => false,
            ], 500);
        }
    }
}
