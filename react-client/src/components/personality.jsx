import React from 'react'; 
import { ListGroup, ListGroupItem} from 'react-bootstrap';


const Personality = (props) => (
	<ListGroup>
		{props.facets.map(facet => {
			if (facet.percentile > 0.8) {
				return (
					<ListGroupItem style={{fontWeight: 'bold'}} key={facet.trait_id}>{facet.name} {facet.percentile.toFixed(2)}</ListGroupItem>
				)
			} else if (facet.percentile > 0.66) {
				return (
					<ListGroupItem style={{fontStyle: 'itaListGroupItemc'}} key={facet.trait_id}>{facet.name} {facet.percentile.toFixed(2)}</ListGroupItem>
				)
			} else if (facet.percentile < 0.33) {
				return (
					<ListGroupItem key={facet.trait_id} style={{color: 'red'}}>{facet.name} {facet.percentile.toFixed(2)}</ListGroupItem>
				)
			} else {
				return (
					<ListGroupItem key={facet.trait_id}>{facet.name} {facet.percentile.toFixed(2)}</ListGroupItem>
				)
			}
		})}
	</ListGroup>
)

export default Personality;