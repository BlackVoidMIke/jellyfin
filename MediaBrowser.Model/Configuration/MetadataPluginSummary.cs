using System.Collections.Generic;
using MediaBrowser.Model.Entities;

namespace MediaBrowser.Model.Configuration
{
    public class MetadataPluginSummary
    {
        /// <summary>
        /// Gets or sets the type of the item.
        /// </summary>
        /// <value>The type of the item.</value>
        public string ItemType { get; set; }

        /// <summary>
        /// Gets or sets the plugins.
        /// </summary>
        /// <value>The plugins.</value>
        public MetadataPlugin[] Plugins { get; set; }

        /// <summary>
        /// Gets or sets the supported image types.
        /// </summary>
        /// <value>The supported image types.</value>
        public ImageType[] SupportedImageTypes { get; set; }

        public MetadataPluginSummary()
        {
            SupportedImageTypes = new ImageType[] { };
            Plugins = new MetadataPlugin[] { };
        }
    }
}