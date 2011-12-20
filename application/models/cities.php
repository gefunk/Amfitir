<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cities extends CI_Model {

    function __construct()
    {
        parent::__construct();
    }

	/*
	search by city name
	used by main screen to look up cities based on type ahead
	returns city id, city name, region name (state), country
	*/
	function search_cities($city_name)
	{
		$this->db->select("city.id as city_id, city.city as city_name, ".
		"region.name as region_name, "
		."country.name as country_name ".
		"from cities city, country_codes country, int_region_codes region".
		" where city.country_code = country.id".
		" and country.id = region.country_code".
		" and city.state_region = region.region_code".
		" and city.city_ascii like '".$city_name."%' order by city.population desc limit 10", FALSE);
		$query = $this->db->get();
		return $query->result();
	}
	
	/* used to get latitude and longitude of city */
	function get_city_latlong($city_id){
		$this->db->select('latitude, longitude')->from('cities')->where('id',$city_id);
		$query = $this->db->get();
		return $query->row();
	}

}