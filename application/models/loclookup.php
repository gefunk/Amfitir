<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Loclookup extends CI_Model {

	var $key = "AtqeyE65HwK7XmTcOZSZsxslWMpRufYqGK8o86nnOEWP3D5oCXIweJP0UIfzNWaS";
	// URL of Bing Maps REST Services Locations API 
	var $baseURL = "http://dev.virtualearth.net/REST/v1/Locations";
	
    function __construct()
    {
        parent::__construct();
    }
    
    /** lookup any location in any format from bing services eg: Atlanta, GA **/
    function get_location($query)
    {
    	// replace any spaces with %20 for the url
		$query = str_ireplace(" ","%20",$query);
		// Construct the final Locations API URI
		$findURL = $this->baseURL."/".$query."?output=xml&key=".$this->key;
		$response = file_get_contents($findURL);
		//$json_output = json_decode($json);
		
		$xmlResponse = new SimpleXMLElement($response);
		
		$latitude = $xmlResponse->ResourceSets->ResourceSet->Resources->Location->Point->Latitude;
		$longitude = $xmlResponse->ResourceSets->ResourceSet->Resources->Location->Point->Longitude;
		$formattedName = $xmlResponse->ResourceSets->ResourceSet->Resources->Location->Address->Locality;
		if(is_null($formattedName)){
			$formattedName = $xmlResponse->ResourceSets->ResourceSet->Resources->Location->Address->FormattedAddress;
		}
		$country = $xmlResponse->ResourceSets->ResourceSet->Resources->Location->Address->CountryRegion;
		
		$result = array(
				"name" => $formattedName,
				"country" => $country,
				"latitude" => $latitude,
				"longitude" => $longitude
			);
        return $result;
    }
    
    function get_location_by_coordinate($lat, $lon)
    {
        $findURL = $this->baseURL."/".$lat.",".$lon."?output=xml&key=".$this->key;
        $response = file_get_contents($findURL);
        $xmlResponse = new SimpleXMLElement($response);
        
        $district1 = $xmlResponse->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict;
        $district2 = $xmlResponse->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict2;
        $countryRegion = $xmlResponse->ResourceSets->ResourceSet->Resources->Location->Address->CountryRegion;
        
        $geocodedName = $district1.", ".$district2.", ".$countryRegion;
        
        return $geocodedName;
    }
}