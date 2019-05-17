<?php

namespace NAMESPACE;

class DataObjectName extends DataObject {
	private static $table_name = '';
	private static $singular_name = '';
	private static $plural_name = '';
	private static $searchable_fields = [];
	private static $summary_fields =[];


	private static $has_one = [];
	private static $has_many = []; 

	private static $db = [
		"Title" => "Text",
		"Content" => "Text",
		"SortOrder" => "Int"
	];

	private static $default_sort = "SortOrder ASC";
}