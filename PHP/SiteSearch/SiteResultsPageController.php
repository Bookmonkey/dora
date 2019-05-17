<?php

use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\PaginatedList;
use SilverStripe\View\ArrayData;

class SearchResultsPageController extends PageController
{
    private static $allowed_actions = [
        "paginationForm"
    ];

    public function SearchQuery()
    {
        $request = $this->getRequest();
        return $request->getVar("search");
    }

    public function Results()
    {
        $session = Injector::inst()
            -> get(HTTPRequest::class)
            -> getSession();

        $results = unserialize($session->get("searchResults"));
        if (!$results) return;

        $itemList = new ArrayList(
            array_map(function($item) {
                return new ArrayData([
                    "Title" => $item->title,
                    "Link" => $item->link,
                    "Description" => preg_replace("/\n/", "", $item->snippet)
                ]);
            }, $results->ToArray())
        );

        return new PaginatedList($itemList, $this->getRequest());
    }
}