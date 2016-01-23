package com.pyrenty.akl.repository;

import com.pyrenty.akl.domain.Text;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Text entity.
 */
public interface TextRepository extends JpaRepository<Text,Long> {

}