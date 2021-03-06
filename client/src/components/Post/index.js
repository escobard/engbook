import React from "react";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import Toggle from "material-ui/Toggle";

import chatPlaceholder from "../../static/guy.jpg";
import postPlaceholder from "../../static/post-placeholder.jpg";

import styles from "./styles.scss";

export default class CardExampleControlled extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleExpandChange = expanded => {
    this.setState({ expanded: expanded });
  };

  handleToggle = (event, toggle) => {
    this.setState({ expanded: toggle });
  };

  handleExpand = () => {
    this.setState({ expanded: true });
  };

  handleReduce = () => {
    this.setState({ expanded: false });
  };

  render() {
    return (
      <article className="post-container col-md-8 col-sm-12">
        <Card
          expanded={this.state.expanded}
          onExpandChange={this.handleExpandChange}
        >
          <CardHeader
            title="URL Avatar"
            subtitle="Subtitle"
            avatar={chatPlaceholder}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText>
            <Toggle
              toggled={this.state.expanded}
              onToggle={this.handleToggle}
              labelPosition="right"
              label="This toggle controls the expanded state of the component."
            />
          </CardText>
          <CardMedia
            expandable={true}
            overlay={
              <CardTitle title="Overlay title" subtitle="Overlay subtitle" />
            }
          >
            <img src={postPlaceholder} alt="" />
          </CardMedia>
          <CardTitle
            title="Card title"
            subtitle="Card subtitle"
            expandable={true}
          />
          <CardText expandable={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec
            vulputate interdum sollicitudin. Nunc lacinia auctor quam sed
            pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque
            lobortis odio.
          </CardText>
          <CardActions>
            <FlatButton label="Expand" onClick={this.handleExpand} />
            <FlatButton label="Reduce" onClick={this.handleReduce} />
          </CardActions>
        </Card>
      </article>
    );
  }
}
