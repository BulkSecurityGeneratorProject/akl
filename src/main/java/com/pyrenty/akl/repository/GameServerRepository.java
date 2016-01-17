package com.pyrenty.akl.repository;

import com.pyrenty.akl.domain.GameServer;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the GameServer entity.
 */
public interface GameServerRepository extends JpaRepository<GameServer,Long> {

}