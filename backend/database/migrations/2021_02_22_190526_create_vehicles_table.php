<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehiclesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->unsigned()->nullable();
            $table->integer('tag_id')->nullable();
            $table->string('zipCode', 9)->nullable();
            $table->string('city')->nullable();
            $table->string('city_url')->nullable();
            $table->string('uf', 2)->nullable();
            $table->string('uf_url', 2)->nullable();
            $table->integer('vehicle_type')->nullable();
            $table->integer('vehicle_brand')->nullable();
            $table->integer('vehicle_model')->nullable();
            $table->integer('vehicle_version')->nullable();
            $table->integer('vehicle_regdate')->nullable();
            $table->integer('vehicle_gearbox')->nullable();
            $table->integer('vehicle_fuel')->nullable();
            $table->integer('vehicle_steering')->nullable();
            $table->integer('vehicle_motorpower')->nullable();
            $table->integer('vehicle_doors')->nullable();
            $table->integer('vehicle_color')->nullable();
            $table->integer('vehicle_cubiccms')->nullable();
            $table->integer('vehicle_owner')->nullable();
            $table->integer('vehicle_mileage')->nullable();
            $table->json('vehicle_features')->nullable();
            $table->json('vehicle_moto_features')->nullable();
            $table->json('vehicle_financial')->nullable();
            $table->double('vehicle_price', 0, 2)->nullable();
            $table->string('title')->nullable();
            $table->longText('description')->nullable();
            $table->tinyInteger('status')->default(0);
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
        Schema::dropIfExists('vehicles');
    }
}
