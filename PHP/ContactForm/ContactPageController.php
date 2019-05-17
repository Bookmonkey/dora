<?php

namespace NAMESPACE\Controllers;

use PageController;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Email\Email;
use SilverStripe\Forms\EmailField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\TextField;
use SilverStripe\SiteConfig\SiteConfig;
use NAMESPACE\Models\ContactSubmission;

class ContactPageController extends PageController
{
    private static $allowed_actions = ['Form'];

    public function Form()
    {
        $form = Form::create(
            $this,
            __FUNCTION__,
            FieldList::create(
                TextField::create('Name', 'Name *'),
                EmailField::create('Email', 'Email *'),
                TextareaField::create('Message', 'Message *')
            ),
            FieldList::create(
                FormAction::create('submitForm', 'Send')
                    ->addExtraClass('btn black contact__btn')
            ),
            RequiredFields::create([
                'Name',
                'Email',
                'Message'
            ])
        );
        $form->enableSpamProtection()
            ->addExtraClass('contact__form');
        return $form;
    }


    public function submitForm($data, Form $form)
    {

        //Store in CMS
        $submission = ContactSubmission::create();
        $form->saveInto($submission);
        $submission->write();

        //Send email with data.
        $to = SiteConfig::current_site_config()->ContactEmail;
        $email = new Email();
        $email->setTo($to)
            ->setSubject('New contact Message')
            ->setBCC('logs@baa.co.nz')
            ->setReplyTo($submission->Email)
            ->setHTMLTemplate('ContactTemplate')
            ->addData([
                'Title' => 'New contact message',
                'Preheader' => 'You have received a new contact message',
                'SiteName' => SiteConfig::current_site_config()->Title,
                'Name' => $submission->Name,
                'Email' => $submission->Email,
                'Message' => $submission->Message
            ]);

        $email->send();
        $this->getRequest()->getSession()->set('FormSuccess', true);
        return $this->redirect(Controller::curr()->Link());
    }

    public function wasSuccessful()
    {
        if ($this->getRequest()->getSession()->get('FormSuccess')) {
            $this->getRequest()->getSession()->clear('FormSuccess');
            return true;
        }
        return false;
    }
}