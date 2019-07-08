<?php

namespace {{#NAMESPACE}}\Pages;

use Page;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\Forms\TextareaField;

class ContactPage extends Page
{
    private static $table_name = "ContactPage";

    private static $db = [
        'SuccessMessage' => 'Text',
    ];


    private static $defaults = [
        'SuccessMessage' => "Your contact submission was successful, a member of the team will get in touch"
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->addFieldsToTab('Root.Main', [
            TextareaField::create('SuccessMessage')
                ->setDescription('Message that will display to the user after the form is submitted')
                ->addExtraClass('stacked')
        ], 'Metadata');

        return $fields;
    }

    public function getControllerName()
    {
        return ContactPageController::class;
    }
}