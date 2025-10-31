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
        Schema::create('file_relations', function (Blueprint $table) {
           $table->id();
            $table->foreignId('file_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('type_id');
            $table->enum('type', ['T', 'L']);
            $table->timestamps();
            $table->index(['type', 'type_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_relations');
    }
};
