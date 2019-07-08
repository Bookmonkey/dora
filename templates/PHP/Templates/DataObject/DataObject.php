<?php

namespace NAMESPACE;

class DataObjectName extends DataObject {
	private static $table_name = '{{ #tableName }}';
	private static $singular_name = '{{ #singularName }}';
	private static $plural_name = '{{ #pluralName }}';
	private static $searchable_fields = [];
	private static $summary_fields =[];


	private static $has_one = [];
	private static $has_many = []; 

	private static $db = {{ #fields }}

	private static $default_sort = "SortOrder ASC";
}