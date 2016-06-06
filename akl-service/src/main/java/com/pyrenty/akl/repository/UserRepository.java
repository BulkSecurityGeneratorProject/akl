package com.pyrenty.akl.repository;

import com.pyrenty.akl.domain.User;

import org.joda.time.DateTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the User entity.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneById(Long id);

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndCreatedDateBefore(DateTime dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneByLogin(String login);

    Optional<User> findOneBySteamId(String steamId);

    Optional<User> findOneByCommunityId(String communityId);

    // Use object rather than id
    @Override
    void delete(User t);

}
