<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plans;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $plans = [
           [
            'title' => 'Mensal',
            'price' => (float) '19.90',
            'equivalent' => (float) '19.90'
           ],
           [
            'title' => 'Semestral',
            'price' => (float) '107.40',
            'equivalent' => (float) '17.90',
            'discount' => '-10%'
           ],
           [
            'title' => 'Anual',
            'price' => (float) '179.00',
            'equivalent' => (float) '14.90',
            'discount' => '-25%'
           ],

        ];

        foreach($plans as $item){
             Plans::create($item);
        }
    }
}
