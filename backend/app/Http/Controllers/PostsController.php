<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Posts;

class PostsController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        // Filter by dates ans status
        if (!empty($request->date_init) && !empty($request->date_end)) {
            return Posts::whereBetween('date', [$request->date_init, $request->date_end])
                ->where('status', $request->status)
                ->get();
        }
        // Filter by status
        if (isset($request->status)) {
            return Posts::where('status', $request->status)->get();
        }

        return Posts::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        try {
            // Validations
            $valid_post = Validator::make(
                $request->all(),
                [
                    'user_id' => 'required',
                    'content' => 'required',
                    'status' => 'required',
                    'title' => 'required',
                ]
            );
            if ($valid_post->fails()) {
                return response()->json([
                    'errors' => $valid_post->errors(),
                    'message' => 'Validation error',
                    'status' => false,
                ], 401);
            }

            $post = Posts::create([
                'user_id' => $request->user_id,
                'content' => $request->content,
                'status' => $request->status,
                'title' => $request->title,
                'date' => date('Y-m-d')
            ]);

            return response()->json([
                'message' => 'Post created',
                'status' => true,
                'user' => $post,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
                'status' => false,
            ], 500);
        }
    }

    /**
     * Update a resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request) {
        try {
            // Validations
            $valid_post = Validator::make(
                $request->all(),
                [
                    'id' => 'required'
                ]
            );
            if ($valid_post->fails()) {
                return response()->json([
                    'errors' => $valid_post->errors(),
                    'message' => 'Validation error',
                    'status' => false,
                ], 401);
            }

            $update = [];
            if (!empty($request->content)) $update['content'] = $request->content;
            if (!empty($request->status)) $update['status'] = $request->status;
            if (isset($request->title)) $update['title'] = $request->title;

            return Posts::where('id', $request->id)
                ->update($update);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
                'status' => false,
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        $post = Posts::find($id);
        $post->delete();
    }
}
