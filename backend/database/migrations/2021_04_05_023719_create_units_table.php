<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUnitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->nullable();
            $table->string('phone', 15)->nullable();
            $table->string('phone2', 15)->nullable();
            $table->string('phone3', 15)->nullable();
            $table->string('zipCode', 9)->nullable();
            $table->string('uf', 2)->nullable();
            $table->string('city')->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('street')->nullable();
            $table->string('streetNumber', 7)->nullable();
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
        Schema::dropIfExists('units');
    }
}
