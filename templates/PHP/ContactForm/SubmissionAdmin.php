<?php

namespace NAMESPACE\Admins;

use SilverStripe\Admin\ModelAdmin;
use NAMESPACE\Models\ContactSubmission;

class SubmissionsAdmin extends ModelAdmin
{
    private static $url_segment = "form-submissions";
    private static $menu_title = "Form Submissions";

    private static $managed_models = [
        ContactSubmission::class
    ];
}