import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

const SongList = ({ songs, urls }) => (
  <ListGroup>
    {songs.map(song => {
      return (
        <ListGroupItem key={song.uri}>
          <a
            href={song.external_urls.spotify}
            style={{ textDecoration: "none" }}
          >
            {song.album.artists[0].name} - {song.name}
          </a>
          <a
            href={
              urls.filter(url => {
                return (
                  url
                    .toLowerCase()
                    .indexOf(
                      song.album.artists[0].name
                        .replace(/\s+/g, "-")
                        .toLowerCase()
                    ) > -1 ||
                  url
                    .toLowerCase()
                    .indexOf(song.name.replace(/\s+/g, "-").toLowerCase()) > -1
                );
              })[0]
            }
            style={{ textDecoration: "none", float: "right" }}
          >
            {" "}
            Lyrics
          </a>
        </ListGroupItem>
      );
    })}
  </ListGroup>
);

export default SongList;
