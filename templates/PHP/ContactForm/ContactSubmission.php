<?php

namespace NAMESPACE\Models;

use SilverStripe\ORM\DataObject;

class ContactSubmission extends DataObject
{
    private static $table_name = "ContactSubmission";

    private static $db = [
        'Name' => 'Varchar(255)',
        'Email' => 'Varchar(255)',
        'Message' => 'Text'
    ];

    private static $default_sort = "Created DESC";
}