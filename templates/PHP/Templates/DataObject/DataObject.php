<?php

namespace {{ #namespace }};

class DataObjectName extends DataObject
{
	private static $table_name = '{{ #tableName }}';
	private static $singular_name = '{{ #tableName }}';
	private static $plural_name = '{{ #tableName }}';
	private static $searchable_fields = [];
	private static $summary_fields = [];


	private static $has_one = [];
	private static $has_many = [];

	private static $db = {{ #fields }};

	private static $default_sort = "SortOrder ASC";
}
