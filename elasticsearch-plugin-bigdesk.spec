https://github.com/downloads/andreas-marschke/bigdesk/elasticsearch-plugin-bigdesk-1.0.0.zip
hckage %{nil}
%define base_install_dir %{_javadir}/%{name}
%define site_install_dir %{base_install_dir}/plugins/bigdesk/_site
# Avoid running brp-java-repack-jars
%define __os_install_post %{nil}

Name:           elasticsearch-plugin-bigdesk
Version:        1.0.0
Release:        1%{?dist}
Summary:        ElasticSearch plugin to use BigDesk

Group:          System Environment/Daemons
License:        ASL 2.0
URL:            https://github.com/elasticsearch/elasticsearch-bigdesk

Source0:        https://github.com/downloads/andreas-marschke/bigdesk/elasticsearch-plugin-bigdesk-%{version}.zip
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildArch:      noarch

Requires:       elasticsearch >= 0.19

%description
Live charts and statistics for ElasticSearch cluster.

%prep
rm -fR %{name}-%{version}
%{__mkdir} -p %{name}-%{version}
cd %{name}-%{version}
%{__mkdir} -p plugins
unzip %{SOURCE0} -d plugins/bigdesk

%build
true

%install
rm -rf $RPM_BUILD_ROOT
cd %{name}-%{version}
%{__mkdir} -p %{buildroot}/%{site_install_dir}js
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/charts
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/charts/time-series
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/charts/not-available
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/charts/time-area
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/util
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/models
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/models/cluster
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/store
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/lib
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/lib/css3-mediaqueries
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/lib/mustache
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/lib/D3-v2.8.1
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/lib/tinysort
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/lib/underscore
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/lib/jquery
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/lib/backbone
%{__mkdir} -p %{buildroot}/%{site_install_dir}js/views
%{__mkdir} -p %{buildroot}/%{site_install_dir}images
%{__mkdir} -p %{buildroot}/%{site_install_dir}css
%{__mkdir} -p %{buildroot}/%{site_install_dir}css/CssGrid_2
%{__install} -D -m 755 plugins/bigdesk/js/charts/time-series/time-series-chart.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/charts/time-series/time-series-chart.css -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/charts/bigdesk_charts.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/charts/not-available/not-available-chart.css -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/charts/not-available/not-available-chart.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/charts/time-area/time-area-chart.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/charts/time-area/time-area-chart.css -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/charts/common.css -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/util/bigdesk_extension.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/models/Hello.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/models/cluster/NodeInfo.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/models/cluster/NodesStats.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/models/cluster/NodesState.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/models/cluster/ClusterHealth.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/store/BigdeskStore.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/css3-mediaqueries/License.txt -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/css3-mediaqueries/css3-mediaqueries.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/mustache/mustache.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/mustache/LICENSE -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/D3-v2.8.1/d3.v2.min.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/D3-v2.8.1/LICENSE -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/tinysort/License.txt -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/tinysort/jquery.tinysort.min.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/underscore/underscore-min.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/underscore/LICENSE -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/jquery/jquery-1.7.1.min.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/backbone/backbone-min.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/lib/backbone/LICENSE -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/views/SelectedClusterNodeView.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/views/ClusterNodesListView.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/views/templates.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/views/ClusterHealthView.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/js/bigdeskApp.js -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/index.html -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/images/award_star_gold.png -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/images/es-logo.png -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/images/1license.txt -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/css/reset.css -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/css/normalize.css -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/css/CssGrid_2/ie.css -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/css/CssGrid_2/styles.css -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/css/CssGrid_2/License.txt -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/css/CssGrid_2/1140.css -t %{buildroot}/%{site_install_dir}/
%{__install} -D -m 755 plugins/bigdesk/css/bigdesk.css -t %{buildroot}/%{site_install_dir}/
%files
%defattr(-,root,root,-)
%dir %{base_install_dir}/plugins/bigdesk
%{base_install_dir}/plugins/bigdesk/*

%changelog
* Tue Aug 14 2012 Andreas Marschke 1.0.0-0
- Initial package

