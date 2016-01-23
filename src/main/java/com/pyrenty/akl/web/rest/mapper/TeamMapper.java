package com.pyrenty.akl.web.rest.mapper;

import com.pyrenty.akl.domain.*;
import com.pyrenty.akl.web.rest.dto.TeamDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Team and its DTO TeamDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TeamMapper {

    TeamDTO teamToTeamDTO(Team team);

    @Mapping(target = "captain", ignore = true)
    @Mapping(target = "members", ignore = true)
    @Mapping(target = "standins", ignore = true)
    Team teamDTOToTeam(TeamDTO teamDTO);
}
