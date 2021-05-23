<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehiclePhotosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_photos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->bigInteger('vehicle_id')->nullable();
            $table->string('img')->nullable();
            $table->bigInteger('order')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehicle_photos');
    }
}
