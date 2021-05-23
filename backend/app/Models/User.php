<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable, SoftDeletes;

    protected $guarded = [
        'id',
        'plan_id',
        'password',
        'remember_token',
        'next_expiration',
        'disabled_account',
        'delete_account',
        'email_verified_at',
        'deleted_at',
        'expira',
        'delete',
        'disable',
        'status'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'next_expiration',
        'disabled_account',
        'delete_account',
        'email_verified_at',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
