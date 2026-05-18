<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
     Schema::create('lessons', function (Blueprint $table) {
    $table->id();

    $table->foreignId('course_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->integer('order')->default(0);

    $table->string('title');
    $table->string('video_url')->nullable();
    $table->string('duration')->nullable();

    $table->boolean('is_free')->default(true);

    $table->timestamps();

    $table->index('course_id');
    $table->unique(['course_id', 'order']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
