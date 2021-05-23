<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleVersionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicle_versions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('brand_id')->nullable();
            $table->bigInteger('model_id')->nullable();
            $table->string('label')->nullable();
            $table->bigInteger('value')->nullable();

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
        Schema::dropIfExists('vehicle_versions');
    }
}
