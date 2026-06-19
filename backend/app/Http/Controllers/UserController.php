<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{





    /**
     * تحديث بيانات الملف الشخصي (للطالب)
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'email' => [
                'required',
                'email',
                Rule::unique('user')->ignore($user->id), // تأكد أن اسم الجدول 'user' كما في الـ ERD
            ],
            'password' => 'nullable|min:8|confirmed',
            // لو عندك حقل للصورة الشخصية في المستقبل
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:1024',
        ]);

        $data = $request->only(['email', 'status']);

        // تحديث الباسورد فقط لو تم إرساله
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * عرض كل المستخدمين (للأدمن فقط)
     */
    public function index()
    {
        // عرض المستخدمين مع عدد اشتراكاتهم
        $users = User::withCount('subscriptions')->latest()->paginate(10);
        return response()->json($users);
    }

    /**
     * جلب بيانات مستخدم معين مع إحصائياته (للأدمن)
     */
    public function show($id)
    {
        $user = User::with(['subscriptions.course', 'progress.lesson'])->findOrFail($id);
        
        return response()->json([
            'user' => $user,
            'stats' => [
                'total_subscriptions' => $user->subscriptions()->count(),
                'completed_lessons' => $user->progress()->where('watched', true)->count(),
            ]
        ]);
    }

    /**
     * تغيير حالة المستخدم (تجميد حساب مثلاً)
     */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->status = ($user->status === 'active') ? 'inactive' : 'active';
        $user->save();

        return response()->json([
            'message' => "User status changed to {$user->status}",
            'status' => $user->status
        ]);
    }
}