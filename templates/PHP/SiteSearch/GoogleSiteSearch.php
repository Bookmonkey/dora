<?php

// Ethan

use SilverStripe\Core\Config\Config;

class GoogleSiteSearch
{
    protected $api_key;
    protected $search_engine_id;
    protected $site_restricted;
    /**
     * GoogleSiteSearch constructor.
     */
    public function __construct()
    {
        $config = Config::inst();
        $this->api_key = $config->get(GoogleSiteSearch::class, 'api_key');
        $this->search_engine_id = $config->get(GoogleSiteSearch::class, 'search_engine_id');
        $this->site_restricted = $config->get(GoogleSiteSearch::class, 'site_restricted');
    }
    /**
     * @param $query
     * @param $start Google custom search engine API only returns 10 results at a time, need a way to request next results
     */
    public function getResults($query, $start = 1)
    {
        /**
         * Check whether keys have been set
         */
        if (empty($this->api_key)) {
            throw new InvalidArgumentException('Missing API key');
        }
        if (empty($this->search_engine_id)) {
            throw new InvalidArgumentException('Missing Search engine id');
        }
        if (empty($this->site_restricted)) {
            $this->site_restricted = false;
        }

        try {
            $url = "https://www.googleapis.com/customsearch/v1/";
            if ($this->site_restricted) {
                $url .= "siterestrict/";
            }
            $query = urlencode($query);
            $response = file_get_contents ($url ."?q=$query&key={$this->api_key}&cx={$this->search_engine_id}&start=$start");
            return $response;
        } catch (TransferException $e) {
            echo 'Oops something went wrong. Actual error: ' . $e->getMessage();
        }
    }
}