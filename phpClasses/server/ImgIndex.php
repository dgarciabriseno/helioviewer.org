<?php
class ImgIndex {
  private $dbConnection;

  public function __construct($dbConnection) {
    $this->dbConnection = $dbConnection;
  }

	/* needs to be changed to the new DB scheme
  public function getImageId($fields) {
    $query = "SELECT imageId FROM images WHERE";
    $i = 0;
    foreach($fields as $key => $value) {
      if ($i>0) $query .= " AND";
      $query .= " $key='$value'";
      $i++;
    }
    $query .= " ORDER BY timestamp";
    $result = $this->dbConnection->query($query);
    $row = mysql_fetch_array($result);
    return $row['map'];
  }
  */

  public function getProperties($imageId) {
    $query = "SELECT image.id AS imageId, filetype, measurement.name AS measurement, measurementType.name AS type, unit, 
    						detector.name AS detector, instrument.name AS instrument, observatory.name AS observatory, 
    						UNIX_TIMESTAMP(timestamp) - UNIX_TIMESTAMP('1970-01-01 00:00:00') AS timestamp
    					FROM image
							LEFT JOIN measurement on measurementId = measurement.id
							LEFT JOIN measurementType on measurementTypeId = measurementType.id
							LEFT JOIN detector on detectorId = detector.id
							LEFT JOIN instrument on instrumentId = instrument.id
							LEFT JOIN observatory on observatoryId = observatory.id 
							WHERE image.id=$imageId";
    $result = $this->dbConnection->query($query);
    return mysql_fetch_array($result, MYSQL_ASSOC);
  }

  public function getClosestImage($timestamp, $src) {
    $query = "SELECT image.id AS imageId, filetype, measurement.name AS measurement, measurementType.name AS type, unit, 
    						detector.name AS detector, instrument.name AS instrument, observatory.name AS observatory, 
    						UNIX_TIMESTAMP(timestamp) - UNIX_TIMESTAMP('1970-01-01 00:00:00') AS timestamp,
								UNIX_TIMESTAMP(timestamp) - UNIX_TIMESTAMP('1970-01-01 00:00:00') - $timestamp AS timediff,
								ABS(UNIX_TIMESTAMP(timestamp) - UNIX_TIMESTAMP('1970-01-01 00:00:00') - $timestamp) AS timediffAbs 
							FROM image
							LEFT JOIN measurement on measurementId = measurement.id
							LEFT JOIN measurementType on measurementTypeId = measurementType.id
							LEFT JOIN detector on detectorId = detector.id
							LEFT JOIN instrument on instrumentId = instrument.id
							LEFT JOIN observatory on observatoryId = observatory.id
              WHERE";
    $i=0;
    foreach($src as $key => $value) {
      if ($i>0) $query .= " AND";
      $query .= " $key='$value'";
      $i++;
    }

    $query .= " ORDER BY timediffAbs LIMIT 0,1";
//echo "$query\n<br>";
    $result = $this->dbConnection->query($query);
    return mysql_fetch_array($result, MYSQL_ASSOC);
  }

/*
  public function getDefaultImage() {
    $query = "SELECT map FROM maps WHERE instrument='EIT' ORDER BY timestamp DESC LIMIT 0,1";
    $result = $this->dbConnection->query($query);
    $row = mysql_fetch_array($result);
    return $row['map'];
  }
*/
	
	// ToDo: Search function
}
?>
