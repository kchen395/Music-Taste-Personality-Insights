import React from 'react'; 


const Personality = (props) => (
	<div>
		{props.facets.map(facet => {
			if (facet.percentile > 0.8) {
				return (
					<li style={{fontWeight: 'bold'}} key={facet.trait_id}>{facet.name} {facet.percentile.toFixed(2)}</li>
				)
			} else if (facet.percentile > 0.66) {
				return (
					<li style={{fontStyle: 'italic'}} key={facet.trait_id}>{facet.name} {facet.percentile.toFixed(2)}</li>
				)
			} else if (facet.percentile < 0.33) {
				return (
					<li key={facet.trait_id} style={{color: 'red'}}>{facet.name} {facet.percentile.toFixed(2)}</li>
				)
			} else {
				return (
					<li key={facet.trait_id}>{facet.name} {facet.percentile.toFixed(2)}</li>
				)
			}
		})}
	</div>
)

export default Personality;