<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\plan;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Support\Facades\Auth;

class PlanController extends Controller
{
    /**
     *  Start or Subscribe to a plan
     */
        public function index()
    {
        $plans = Plan::all();

        return response()->json([
            'status' => true,
            'message' => 'Plans fetched successfully',
            'data' => $plans
        ]);
    }

public function startPlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $user = Auth::user();

        // 1. check active subscription
        $activeSubscription = Subscription::where('user_id', $user->id)
            ->where('end_date', '>', now())
            ->first();

        if ($activeSubscription) {
            return response()->json([
                'status' => false,
                'message' => 'You already have an active subscription',
            ], 400);
        }

        // 2. get plan
        $plan = Plan::findOrFail($request->plan_id);

        // 3. calculate dates
        $startDate = now();
        $endDate = now()->addDays($plan->duration_days);

        // 4. create subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'active',
        ]);

      
        // 6. response
        return response()->json([
            'status' => true,
            'message' => 'Subscribed successfully 🎉',
            'subscription' => $subscription,
            'plan' => $plan,
        ]);
    }

    /**
     *  Check current plan status
     */
}