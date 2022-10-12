<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Comments;

class CommentsController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        // Filter by status
        if (!empty($request->post_id)) {
            return Comments::where('post_id', $request->post_id)->get();
        }

        return Comments::all();
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
            $valid_comment = Validator::make(
                $request->all(),
                [
                    'user_id' => 'required',
                    'content' => 'required',
                    'post_id' => 'required',
                ]
            );
            if ($valid_comment->fails()) {
                return response()->json([
                    'errors' => $valid_comment->errors(),
                    'message' => 'Validation error',
                    'status' => false,
                ], 401);
            }

            $comment = Comments::create([
                'user_id' => $request->user_id,
                'post_id' => $request->post_id,
                'content' => $request->content,
            ]);

            return response()->json([
                'message' => 'Comment created',
                'status' => true,
                'user' => $comment,
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
            $valid_comment = Validator::make(
                $request->all(),
                [
                    'id' => 'required'
                ]
            );
            if ($valid_comment->fails()) {
                return response()->json([
                    'errors' => $valid_comment->errors(),
                    'message' => 'Validation error',
                    'status' => false,
                ], 401);
            }

            $update = [];
            if (!empty($request->content)) $update['content'] = $request->content;

            return Comments::where('id', $request->id)
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
        $comment = Comments::find($id);
        $comment->delete();
    }
}
